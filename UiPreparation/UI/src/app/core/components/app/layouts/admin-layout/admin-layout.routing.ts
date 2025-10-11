import { Routes } from '@angular/router';
import { GroupComponent } from 'app/core/components/admin/group/group.component';
import { LanguageComponent } from 'app/core/components/admin/language/language.component';
import { LogDtoComponent } from 'app/core/components/admin/log/logDto.component';
import { LoginComponent } from 'app/core/components/admin/login/login.component';
import { OperationClaimComponent } from 'app/core/components/admin/operationclaim/operationClaim.component';
import { TranslateComponent } from 'app/core/components/admin/translate/translate.component';
import { UserComponent } from 'app/core/components/admin/user/user.component';
import { LoginGuard } from 'app/core/guards/login-guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';





export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent,canActivate:[LoginGuard] }, 
    { path: 'user',           component: UserComponent, canActivate:[LoginGuard] },
    { path: 'group',          component: GroupComponent, canActivate:[LoginGuard] },
    { path: 'login',          component: LoginComponent },
    { path: 'language',       component: LanguageComponent,canActivate:[LoginGuard]},
    { path: 'translate',      component: TranslateComponent,canActivate:[LoginGuard]},
    { path: 'operationclaim', component: OperationClaimComponent,canActivate:[LoginGuard]},
    { path: 'log',            component: LogDtoComponent,canActivate:[LoginGuard]},
    { 
      path: 'colors', 
      loadChildren: () => import('app/features/colors/colors.module').then(m => m.ColorsModule),
      canActivate: [LoginGuard]
    },
    { 
      path: 'customers', 
      loadChildren: () => import('app/features/customers/customers.module').then(m => m.CustomersModule),
      canActivate: [LoginGuard]
    },
    { 
      path: 'orders', 
      loadChildren: () => import('app/features/orders/orders.module').then(m => m.OrdersModule),
      canActivate: [LoginGuard]
    },
    { 
      path: 'warehouse', 
      loadChildren: () => import('app/features/warehouse/warehouse.module').then(m => m.WarehouseModule),
      canActivate: [LoginGuard]
    },
    { 
      path: 'reports', 
      loadChildren: () => import('app/features/reports/reports.module').then(m => m.ReportsModule),
      canActivate: [LoginGuard]
    }
    
];
