import { Routes } from '@angular/router';
import { loggedGuard } from './core/guards/logged-guard';

export const routes: Routes = [
    {path: '', loadComponent: () =>import('./features/home/pages/home/home.component').then(m => m.HomeComponent),title: 'Home'},
    
    {path: 'brands', loadComponent: () =>import('./features/brands/pages/brands/brands.component').then(m => m.BrandsComponent)},

    {path: 'support', loadComponent: () =>import('./features/support/pages/support/support.component').then(m => m.SupportComponent)},
    
    {path: 'brands/:id',loadComponent: () =>import('./features/brands/pages/brand-details/brand-details.component').then(m => m.BrandDetailsComponent)},
    
    {path: 'shop',loadComponent: () =>import('./features/shop/pages/shop/shop.component').then(m => m.ShopComponent)},

    {path: 'shop/:slug/:id',loadComponent: () =>import('./features/shop/pages/shop-details/shop-details.component').then(m => m.ShopDetailsComponent)},

    {path: 'categories',loadComponent: () =>import('./features/categories/pages/categories-details/categories-details.component').then(m => m.CategoriesDetailsComponent)},

    {path: 'categories/:slug/:id',loadComponent: () =>import('./features/categories/pages/categories-details/categories-details.component').then(m => m.CategoriesDetailsComponent)},
    
    {path: 'login',loadComponent: () =>import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),title: 'Login'},
    
    {path: 'register',loadComponent: () =>import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent),title: 'Register'},
    
    {path: 'forget-password',loadComponent: () =>import('./features/auth/pages/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),title: 'Forget Password'},
    
    {path: 'cart',canActivate:[loggedGuard], loadComponent: () =>import('./features/cart/pages/cart/cart.component').then(m => m.CartComponent),title: 'Cart'},
    
    {path: 'wishlist',canActivate:[loggedGuard],loadComponent: () =>import('./features/wishlist/pages/wishlist/wishlist.component').then(m => m.WishlistComponent),title: 'Wishlist'},
    
    {path: 'checkout/:id',canActivate:[loggedGuard],loadComponent: () =>import('./features/payment/pages/check-out/check-out.component').then(m => m.CheckOutComponent),title: 'Checkout'},

    {path: 'order',canActivate:[loggedGuard], loadComponent: () =>import('./features/payment/pages/orders/orders.component').then(m => m.OrdersComponent),title: 'My Orders'},

    // Safety net in case the payment API redirects to /allorders
    {path: 'allorders', redirectTo: 'order', pathMatch: 'full'},

    {path: '**',redirectTo: '', pathMatch:'full'}
];