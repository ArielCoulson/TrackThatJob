import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


/**
 * We will need to add routes when we add more pages
 * NOTE: We don't have a "pages" directory. So ignore that.
 * EX:
 * { path: '', loadChildren: './pages/idea-list/idea-list.module#IdeaListPageModule' },
  { path: 'idea', loadChildren: './pages/idea-details/idea-details.module#IdeaDetailsPageModule' },
  { path: 'idea/:id', loadChildren: './pages/idea-details/idea-details.module#IdeaDetailsPageMod
 */
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'add', loadChildren: './add/add.module#AddPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
