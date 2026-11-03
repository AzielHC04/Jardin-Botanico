import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../services/auth.service';


export const adminGuard:
  CanActivateFn =
  async (
    route,
    state
  ) => {


    const authService =
      inject(
        AuthService
      );


    const router =
      inject(
        Router
      );


    const puedeAcceder =
      await authService
        .puedeAccederAdmin();


    if (puedeAcceder) {

      return true;

    }


    return router.createUrlTree(
      [
        '/admin/login'
      ],
      {
        queryParams: {

          returnUrl:
            state.url

        }
      }
    );

  };