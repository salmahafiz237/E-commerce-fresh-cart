import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () =>import('./features/home/pages/home/home.component').then(m => m.HomeComponent),title: 'Home'},
    
    {path: 'brands', loadComponent: () =>import('./features/brands/pages/brands/brands.component').then(m => m.BrandsComponent)},
    
    {path: 'brands/:id',loadComponent: () =>import('./features/brands/pages/brand-details/brand-details.component').then(m => m.BrandDetailsComponent)},
    
    {path: 'shop',loadComponent: () =>import('./features/shop/pages/shop/shop.component').then(m => m.ShopComponent)},

    {path: 'shop/:slug/:id',loadComponent: () =>import('./features/shop/pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent)},

    {path: 'categories',loadComponent: () =>import('./features/categories/pages/categories-details/categories-details.component').then(m => m.CategoriesDetailsComponent)},

    {path: 'categories/:id',loadComponent: () =>import('./features/categories/pages/categories-details/categories-details.component').then(m => m.CategoriesDetailsComponent)},
    
    {path: 'login',loadComponent: () =>import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),title: 'Login'},
    
    {path: 'register',loadComponent: () =>import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent),title: 'Register'},
    
    {path: 'forget-password',loadComponent: () =>import('./features/auth/pages/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),title: 'Forget Password'},
    
    {path: 'cart',loadComponent: () =>import('./features/cart/pages/cart/cart.component').then(m => m.CartComponent)},
    
    {path: 'wishlist',loadComponent: () =>import('./features/wishlist/pages/wishlist/wishlist.component').then(m => m.WishlistComponent)},
    
    {path: '**',redirectTo: ''}
];
