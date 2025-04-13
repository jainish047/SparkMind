// import "./globals.css";
// import { ReactNode } from "react";
// import { CopilotKit } from "@copilotkit/react-core"; 
// import "@copilotkit/react-ui/styles.css"; 

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         {/* Use the public api key you got from Copilot Cloud  */}
//         <CopilotKit publicApiKey="<your-copilot-cloud-public-api-key>"> 
//           {children}
//         </CopilotKit>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core"; 
import "@copilotkit/react-ui/styles.css"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Use the public api key you got from Copilot Cloud  */}
        <CopilotKit publicApiKey="ck_pub_d06e5451d8d8f48b962f499c3bf72ae6"> 
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}