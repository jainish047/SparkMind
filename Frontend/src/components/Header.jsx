import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../context/authSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
// import NavListItem from "./NavListItem";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

const exploreItems = [
  {
    title: "Freelancers",
    description: "Search for ",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  return (
    <header className="h-full flex items-center justify-between px-6 py-3 border-b bg-white shadow-md">
      <div className="flex gap-4 items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          P4
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={`text-gray-700  ${
              location.pathname === "/" ? "border-b-2 border-black" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/explore"
            className={`text-gray-700  ${
              location.pathname.includes("explore")
                ? "border-b-2 border-black"
                : ""
            }`}
          >
            Explore
          </Link>
          <Link
            to="/contact"
            className={`text-gray-700  ${
              location.pathname.includes("contact")
                ? "border-b-2 border-black"
                : ""
            }`}
          >
            Contact
          </Link>
        </nav> */}
        {/* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  {["Freelancers", "Projects"].map((component)=>{
                    return <li>{component}</li>
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
        <Menubar className="hidden md:flex border-0 shadow-none">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Link to="/" className="text-black hover:text-blue-500">
                <p className="text-base">Dashboard</p>
              </Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              className="text-black text-base hover:text-blue-500"
              asChild
            >
              <p>Explore</p>
              {/* Explore */}
            </MenubarTrigger>
            <MenubarContent className="mt-2 p-0">
              <MenubarItem className="text-base" asChild>
                <Link
                  to="/explore/freelancers"
                  className="p-1 hover:bg-gray-100"
                >
                  Freelancers
                </Link>
              </MenubarItem>
              <MenubarItem className="text-base" asChild>
                <Link
                  to="/explore/projects"
                  className="block p-1 hover:bg-gray-100"
                >
                  Projects
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex gap-2 items-center">
        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-4 space-y-3"
            aria-labelledby="menu-title"
          >
            {/* Visually hidden DialogTitle for screen readers */}
            {/* <VisuallyHidden>
              <h2 id="menu-title">Menu</h2>
            </VisuallyHidden> */}
            <SheetHeader>
              {/* <SheetTitle
                className="truncate"
                title={`Hi ${user.name || user.companyName || user.email}`}
              /> */}
              <SheetTitle className="truncate">
                Hi, {user?.name || user?.companyName || user?.email}
              </SheetTitle>
              {/* <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription> */}
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/explore"
                className="text-gray-700 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </nav>
            {/* <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter> */}
          </SheetContent>
        </Sheet>

        {/* Avatar / Login Button */}
        {user ? (
          <div className="flex items-center gap-2">
            <Button className="bg-blue-900 hover:bg-white hover:text-black" onClick={()=>navigate("/newProject")}>Post Project</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    className="w-10 h-10 cursor-pointer"
                    src={
                      user?.profilePic ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user?.name || user?.companyName || user?.email
                      }`
                    }
                  />
                  <AvatarFallback>{(user.name || "U")[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.name || user?.companyName || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link to={`/profile/${user?.id}`} className="text-black">Profile</Link>
                  </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/settings");
                    }}
                    className="cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // dispatch(logoutReducer())
                      dispatch(logoutUser())
                        .unwrap()
                        .then(() => {
                          navigate("/");
                        })
                        .catch((err) => {
                          toast({
                            variant: "destructive",
                            title: "Unable to Logout",
                            // description:err
                            duration: 3000, // Auto-hide after 3 seconds                    })
                          });
                        });
                    }}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex">
            <Link to="/auth/login">
              {/* <Button>Login</Button> */}
              Login
            </Link>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Link to="/auth/signup">
              {/* <Button>Login</Button> */}
              Signup
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
