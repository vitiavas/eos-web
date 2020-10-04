import { RouterModule, Routes } from "@angular/router";
// import { AuthGuard } from '../core/guards/auth.guard';
import { LayoutComponent } from "./layout.component";
import { AuthGuard } from "../core/guards/auth.guard";

const LAYOUT_ROUTES: Routes = [
  {
    path: "",
    runGuardsAndResolvers: "always",
    // canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      // Home
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", loadChildren: "../home/home.module#HomeModule" },
      {
        path: "main",
        loadChildren: "../main-page/main-page.module#MainPageModule"
      },
      { path: "error", loadChildren: "../error/error.module#ErrorModule" }
    ]
  }
];

export const LayoutRouting = RouterModule.forChild(LAYOUT_ROUTES);
