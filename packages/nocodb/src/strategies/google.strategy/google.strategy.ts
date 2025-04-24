import { promisify } from 'util';
import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';
import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import type { VerifyCallback } from 'passport-openidconnect';
import type { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import type { NcRequest } from '~/interface/config';
import Noco from '~/Noco';
import { UsersService } from '~/services/users/users.service';
import { BaseUser, Plugin, User } from '~/models';
import { sanitiseUserObj } from '~/utils';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Optional() clientConfig: any,
    private usersService: UsersService,
  ) {
    super(clientConfig);
  }

  async validate(
    req: NcRequest,
    issuer: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email =
      profile.emails?.[0]?.value ||
      profile.email ||
      profile.preferred_username;

    if (!email) {
      return done(new Error('No email found in OIDC profile'), null);
    }

    try {
      const user = await User.getByEmail(email);
      if (user) {
        if (req.ncBaseId) {
          BaseUser.get(req.context, req.ncBaseId, user.id)
            .then(async (baseUser) => {
              user.roles = baseUser?.roles || user.roles;
              done(null, sanitiseUserObj(user));
            })
            .catch((e) => done(e));
        } else {
          return done(null, sanitiseUserObj(user));
        }
      } else {
        const salt = await promisify(bcrypt.genSalt)(10);
        const newUser = await this.usersService.registerNewUserIfAllowed({
          email_verification_token: null,
          email,
          password: '',
          salt,
          req,
        } as any);

        return done(null, sanitiseUserObj(newUser));
      }
    } catch (err) {
      return done(err);
    }
  }

  authorizationParams(options: any) {
    const params = super.authorizationParams(options) as Record<string, any>;

    if (options.state) {
      params.state = options.state;
    }

    return params;
  }

  async authenticate(req: Request, options?: any): Promise<void> {
    const googlePlugin = await Plugin.getPluginByTitle('Google');

    if (googlePlugin && googlePlugin.input) {
      const settings = JSON.parse(googlePlugin.input);
      process.env.NC_GOOGLE_CLIENT_ID = settings.client_id;
      process.env.NC_GOOGLE_CLIENT_SECRET = settings.client_secret;
    }

    if (
      !process.env.NC_GOOGLE_CLIENT_ID ||
      !process.env.NC_GOOGLE_CLIENT_SECRET
    )
      return this.error({
        message:
          'Google client id or secret not found. Please add it in plugin settings or define env variables.',
      });

    return super.authenticate(req, {
      ...options,
      clientID: process.env.NC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NC_GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: req.ncSiteUrl + Noco.getConfig().dashboardPath,
      passReqToCallback: true,
      scope: ['openid', 'profile', 'email'],
      state: req.query.state,
    });
  }
}

export const GoogleStrategyProvider: FactoryProvider = {
  provide: GoogleStrategy,
  inject: [UsersService],
  useFactory: async (usersService: UsersService) => {
    const clientConfig = {
      clientID: process.env.NC_GOOGLE_CLIENT_ID ?? 'dummy-id',
      clientSecret: process.env.NC_GOOGLE_CLIENT_SECRET ?? 'dummy-secret',
      callbackURL: process.env.NC_PUBLIC_URL + '/dashboard/',
      passReqToCallback: true,
      scope: ['openid', 'profile', 'email'],
      issuer: process.env.NC_GOOGLE_ISSUER,
      authorizationURL: process.env.NC_GOOGLE_ISSUER + '/oauth2/auth',
      tokenURL: process.env.NC_GOOGLE_ISSUER + '/oauth2/token',
      userInfoURL: process.env.NC_GOOGLE_ISSUER + '/userinfo',
      state: true,
    };

    return new GoogleStrategy(clientConfig, usersService);
  },
};