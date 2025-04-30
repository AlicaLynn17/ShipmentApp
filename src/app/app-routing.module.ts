import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page'; // Import standalone component
import { Index2Page } from './index2/index2.page'; // Import standalone component

const routes: Routes = [
  { path: '', component: HomePage }, // Default route for index.html
  { path: 'index2', component: Index2Page }, // Route for index2.html
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
