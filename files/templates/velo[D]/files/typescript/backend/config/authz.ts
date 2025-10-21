import { AuthzConfig } from 'backend/lib/config/model';
import { Roles } from 'public/config';
import { Subscription } from 'public/models/modules/authz.model';

export enum Actions {
    VIEW = 'view',
    CREATE = 'create',
    EDIT = 'edit',
    DELETE = 'delete',
    LIST = 'list',
}

export enum Resources {
    ORGANIZATION = 'organization',
    EVENT = 'event',
}

export const rolesPermissions: { name: string, resource: Resources, permissions: Actions[] }[] = [
	{ name: Roles.MEMBER, resource: Resources.ORGANIZATION, permissions: [Actions.CREATE] },
	{ name: Roles.OWNER, resource: Resources.ORGANIZATION, permissions: [Actions.EDIT, Actions.DELETE] },
	{ name: Roles.OWNER, resource: Resources.EVENT, permissions: [Actions.VIEW, Actions.CREATE, Actions.EDIT, Actions.DELETE] },
	{ name: Roles.VISITOR, resource: Resources.ORGANIZATION, permissions: [Actions.VIEW] },
	{ name: Roles.VISITOR, resource: Resources.EVENT, permissions: [Actions.VIEW] },
] as const;

export const authzConfig: AuthzConfig<typeof Actions, typeof Resources> = {
	modelPath: '/user-code/backend/authz/model.conf',
	policyPath: '/user-code/backend/authz/policy.csv',
	policies: rolesPermissions.map(role => {
		const roles: string[][]=[];
		for (const permission of role.permissions) {
			roles.push([ role.name, role.resource, permission ]);
		}
		
		return roles;
	}).flat(),
	matchFunctions: {
		getSubscriptionLevelValue: (subscription: Subscription, orgCount: number, action: Actions, resource: Resources) => {
			if(subscription.limits.organizations <= orgCount && action === Actions.CREATE && resource === Resources.ORGANIZATION) return false;

			return true;
		}
	},
	actions: Actions,
	resources: Resources,
} as const;

