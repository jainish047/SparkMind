const assignFreelancer = async (req, res) => {
  const { projectId } = req.params;
  const { freelancerId, paymentDetails } = req.body;
  const clientId = req.user.id;

  if (!projectId || !freelancerId) {
    return res
      .status(400)
      .json({ message: "Missing projectId or freelancerId" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.assignedTo)
      return res.status(400).json({ message: "Already assigned" });

    const fee = project.maxBudget * 0.1;

    // Simulate payment (replace with real logic e.g. Stripe)
    const paymentSuccess = true;

    if (!paymentSuccess) {
      return res.status(400).json({ message: "Payment failed" });
    }

    const result = await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          assignedTo: freelancerId,
          status: "ASSIGNED",
        },
      }),
      prisma.payment.create({
        data: {
          userId: clientId,
          projectId,
          amount: fee,
          type: "ASSIGNMENT_FEE",
          status: "COMPLETED",
        },
      }),
    ]);

    res.json({ message: "Freelancer assigned & payment done", result });
  } catch (err) {
    console.error("assignFreelancer error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

const completeMilestone = async (req, res) => {
  const { projectId } = req.params;
  const { milestoneId, freelancerId } = req.body;

  if (!projectId || !milestoneId || !freelancerId) {
    return res
      .status(400)
      .json({ message: "Missing projectId, milestoneId, or freelancerId" });
  }

  try {
    const bid = await prisma.bid.findFirst({
      where: { projectId, userId: freelancerId },
    });

    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const milestones = bid.milestones || [];
    const index = milestones.findIndex((m) => m.id === milestoneId);

    if (index === -1)
      return res.status(404).json({ message: "Milestone not found" });
    if (milestones[index].status === "COMPLETED")
      return res.status(400).json({ message: "Milestone already completed" });

    milestones[index].status = "COMPLETED";
    const payAmount = milestones[index].amount;

    // Simulate payout (replace with real logic e.g. Razorpay/Stripe Connect)
    const payoutSuccess = true;

    if (!payoutSuccess) {
      return res.status(400).json({ message: "Payout failed" });
    }

    const result = await prisma.$transaction([
      prisma.bid.update({
        where: { id: bid.id },
        data: { milestones },
      }),
      prisma.payment.create({
        data: {
          userId: freelancerId,
          projectId,
          amount: payAmount,
          type: "MILESTONE_PAYMENT",
          status: "COMPLETED",
        },
      }),
    ]);

    res.json({
      message: "Milestone marked complete & freelancer paid",
      result,
    });
  } catch (err) {
    console.error("completeMilestone error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

export async function verifyAccount(req, res) {
    const { accountNumber, ifsc, accountHolderName } = req.body;
    const userId = req.user.id;
  
    // Assume external API call for bank verification success
    const verified = true;
  
    if (verified) {
      await prisma.bankAccount.upsert({
        where: { userId },
        update: { accountNumber, ifsc, accountHolderName, verified: true },
        create: { userId, accountNumber, ifsc, accountHolderName, verified: true },
      });
      return res.status(200).send({ message: "Account verified" });
    }
  
    return res.status(400).send({ message: "Verification failed" });
  }

  
  