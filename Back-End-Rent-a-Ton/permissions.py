from rest_framework import permissions

#Creating custom permissions based on the the host/renter status of the users.

class IsHostUser(permissions.BasePermission):

    def has_permission(self,request,view):
        if request.user.is_host:
            return True
        else:
            return False


class IsRenterUser(permissions.BasePermission):

    def has_permission(self,request,view):
        if request.user.is_renter:
            return True
        else:
            return False