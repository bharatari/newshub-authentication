# Access Control Utilities

The goal with NewsHub's access control system is for it to be flexible and configurable yet consistent.

Permissions are the most granular level of access control. Each permission corresponds to a specific action and therefore every given action that can be taken with the application can be regulated with a corresponding permission.

Roles on the other hand do not directly correspond to anything in the system and are instead defined dynamically. There is only one role that automatically exists; the `master` role which gives an administrator complete system access. 

Permissions and roles also regulate access control on the client. NewsHub components are access control-aware meaning components will change their appearance and structure based on the permissions the user has. For example, if a user has the permission to edit a certain field in a data record, it will appear as an editable field and if they only have read access, the field will display as static text. This extends to pages as well. Pages have access control in two ways. The first way is dependency-based access control where the permissions that are needed for the page to properly function are defined for each page. If the user does not have the required permissions, the page will not be accessible to them. The second way is custom access control where you can restrict certain pages to certain roles. Because roles are dynamically defined, these pages are dynamically restricted. In the code, a `dynamic` flag is set and the client knows to check the database for the corresponding role required to access the page and then match that against the user.

## Structure

[deny!]<model>:<action>[!owner]
[deny!]<model>:<property>:<action>[!owner]
[deny!]<model>:<custom>
[deny!]global:<custom>
<role>

## CRUD Permissions

CRUD permissions correspond to standard create, read, update and delete actions. These permissions are implicitly created by the system.

On the server, the `can` function detects whether the user has the given permission for the corresponding service and method. This works for standard CRUD actions. In Feathers, a global hook can be used to authenticate CRUD actions.

## CRUD Property Permissions

These permissions are more granular. An example could be `reservation:approved:update`, giving the ability to approve reservations, or denying that ability by placing a `deny!` flag in front of it. Standard CRUD permissions also cascade downwards. A `reservation:update` flag automatically gives permission to update any properties on that model/service unless there is also a `deny!reservation:<property-name>:update` flag as well.

## Custom Permissions

Custom permissions offer more granular control of server actions. They allow you to check for specific conditions in requests. These permissions must be explicitly defined in the code.

```
if (approved || checkedOut || checkedIn || adminNotes || disabled || specialRequests) {
  if (roles.protect(models, redis, userId, 'reservation:set-status')) {
    // User has authorization to do this
  } else {
    throw new errors.BadRequest('Cannot set reservation status on creation');
  }
}
```

# Owner Modifier

The owner modifier gives the specified role to a user if they own the object they are attempting to access/modify.

## Roles

At the most basic level, a role can describe a user's general status or type. For example, a user can be a student, faculty or administrator. Roles can also act as "permission presets" and automatically grant certain permissions to a user. Roles must be defined in the database. In most cases, you would be better off creating a custom permission to represent a specific block of code rather than specifically checking for a role, unless it's something that does apply to an entire role/group.

## Notes

These utilities do handle the deny option for CRUD actions although it is preferred to use them only for specific properties. The reason is that it is better to be explicit rather than implicit. The deny flag existing only for one level reduces complexity and increases reliability. The alternative to denying an entire CRUD action is simply listing the three other actions. The alternative to denying a single property is listing every other property is too verbose, which is why the deny flag exists.

The master role gives automatic access to all permissions. A master user will always return true for the can and has functions. It doesn't not necessarily give the user all roles, however. The `is` function is a strict roles check designed for targeting specific groups of users. Giving the master user implicit membership in all of these groups does not make sense. Furthermore, there is no implicit heirarchy of roles beyond the `master` role provided by default, so it wouldn't be prudent for the access control system to make assumptions about it.
