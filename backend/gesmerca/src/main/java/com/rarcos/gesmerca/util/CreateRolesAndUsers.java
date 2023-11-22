package com.rarcos.gesmerca.util;

import com.rarcos.gesmerca.security.entity.Permission;
import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.enums.RoleName;
import com.rarcos.gesmerca.security.service.PermissionService;
import com.rarcos.gesmerca.security.service.RoleService;
import com.rarcos.gesmerca.security.service.UserService;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * MUY IMPORTANTE: ESTA CLASE SÓLO SE EJECUTARÁ UNA VEZ PARA CREAR LOS ROLES.
 * UNA VEZ CREADOS SE DEBERÁ ELIMINAR O BIEN COMENTAR EL CÓDIGO
 *
 */

@Component
@Order(1)
public class CreateRolesAndUsers implements CommandLineRunner {

    @Autowired
    RoleService roleService;

    @Autowired
    UserService userService;

    @Autowired
    PermissionService permissionService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create permissions group
        Set<Permission> permissionsAdmin = new HashSet<>();
        Set<Permission> permissionsEmployee = new HashSet<>();
        Set<Permission> permissionsUser = new HashSet<>();

        // Create permissions
        Permission permissionRoleList = new Permission("role-list");
        Permission permissionRoleCreate = new Permission("role-create");
        Permission permissionRoleEdit = new Permission("role-edit");
        Permission permissionRoleDelete = new Permission("role-delete");
        Permission permissionProductList = new Permission("product-list");
        Permission permissionProductCreate = new Permission("product-create");
        Permission permissionProductEdit = new Permission("product-edit");
        Permission permissionProductDelete = new Permission("product-delete");
        Permission permissionConfigList = new Permission("config-list");
        Permission permissionConfigCreate = new Permission("config-create");
        Permission permissionConfigEdit = new Permission("config-edit");
        Permission permissionConfigDelete = new Permission("config-delete");
        Permission permissionPermissionList = new Permission("permission-list");
        Permission permissionPermissionCreate = new Permission("permission-create");
        Permission permissionPermissionEdit = new Permission("permission-edit");
        Permission permissionPermissionDelete = new Permission("permission-delete");
        Permission permissionSupplierList = new Permission("supplier-list");
        Permission permissionSupplierCreate = new Permission("supplier-create");
        Permission permissionSupplierEdit = new Permission("supplier-edit");
        Permission permissionSupplierDelete = new Permission("supplier-delete");
        Permission permissionGoodsReceiptList = new Permission("goodsreceipt-list");
        Permission permissionGoodsReceiptCreate = new Permission("goodsreceipt-create");
        Permission permissionGoodsReceiptEdit = new Permission("goodsreceipt-edit");
        Permission permissionGoodsReceiptDelete = new Permission("goodsreceipt-delete");

        permissionService.save(permissionRoleList);
        permissionService.save(permissionRoleCreate);
        permissionService.save(permissionRoleEdit);
        permissionService.save(permissionRoleDelete);
        permissionService.save(permissionProductList);
        permissionService.save(permissionProductCreate);
        permissionService.save(permissionProductEdit);
        permissionService.save(permissionProductDelete);
        permissionService.save(permissionConfigList);
        permissionService.save(permissionConfigCreate);
        permissionService.save(permissionConfigEdit);
        permissionService.save(permissionConfigDelete);
        permissionService.save(permissionPermissionList);
        permissionService.save(permissionPermissionCreate);
        permissionService.save(permissionPermissionEdit);
        permissionService.save(permissionPermissionDelete);
        permissionService.save(permissionSupplierList);
        permissionService.save(permissionSupplierCreate);
        permissionService.save(permissionSupplierEdit);
        permissionService.save(permissionSupplierDelete);
        permissionService.save(permissionGoodsReceiptList);
        permissionService.save(permissionGoodsReceiptCreate);
        permissionService.save(permissionGoodsReceiptEdit);
        permissionService.save(permissionGoodsReceiptDelete);

        permissionsAdmin.add(permissionRoleList);
        permissionsAdmin.add(permissionRoleList);
        permissionsAdmin.add(permissionRoleCreate);
        permissionsAdmin.add(permissionRoleEdit);
        permissionsAdmin.add(permissionRoleDelete);
        permissionsAdmin.add(permissionProductList);
        permissionsAdmin.add(permissionProductCreate);
        permissionsAdmin.add(permissionProductEdit);
        permissionsAdmin.add(permissionProductDelete);
        permissionsAdmin.add(permissionConfigList);
        permissionsAdmin.add(permissionConfigCreate);
        permissionsAdmin.add(permissionConfigEdit);
        permissionsAdmin.add(permissionConfigDelete);
        permissionsAdmin.add(permissionPermissionList);
        permissionsAdmin.add(permissionPermissionCreate);
        permissionsAdmin.add(permissionPermissionEdit);
        permissionsAdmin.add(permissionPermissionDelete);
        permissionsAdmin.add(permissionSupplierList);
        permissionsAdmin.add(permissionSupplierEdit);
        permissionsAdmin.add(permissionSupplierCreate);
        permissionsAdmin.add(permissionSupplierDelete);
        permissionsAdmin.add(permissionGoodsReceiptList);
        permissionsAdmin.add(permissionGoodsReceiptCreate);
        permissionsAdmin.add(permissionGoodsReceiptEdit);
        permissionsAdmin.add(permissionGoodsReceiptDelete);
        permissionsEmployee.add(permissionProductList);
        permissionsEmployee.add(permissionProductCreate);
        permissionsEmployee.add(permissionProductEdit);
        permissionsEmployee.add(permissionProductDelete);
        permissionsEmployee.add(permissionConfigList);
        permissionsEmployee.add(permissionConfigEdit);
        permissionsEmployee.add(permissionSupplierList);
        permissionsEmployee.add(permissionSupplierCreate);
        permissionsEmployee.add(permissionSupplierEdit);
        permissionsEmployee.add(permissionSupplierDelete);
        permissionsUser.add(permissionProductList);
        permissionsUser.add(permissionConfigList);
        permissionsUser.add(permissionSupplierList);
        permissionsUser.add(permissionGoodsReceiptList);
        permissionsUser.add(permissionGoodsReceiptCreate);
        permissionsUser.add(permissionGoodsReceiptEdit);
        permissionsUser.add(permissionGoodsReceiptDelete);

        // Crate roles
        Role roleAdmin = new Role(RoleName.Admin);
        Role roleEmployee = new Role(RoleName.Employee);
        Role roleUser = new Role(RoleName.User);
        roleService.save(roleAdmin);
        roleService.save(roleEmployee);
        roleService.save(roleUser);

        // Create users
        User admin = new User();
        admin.setName("Administrador");
        admin.setUserName("admin");
        admin.setEmail("admin@admin.com");
        admin.setPassword(passwordEncoder.encode("administrador"));
        Set<Role> rolesAdmin = new HashSet<Role>();
        rolesAdmin.add(roleAdmin);
        admin.setRoles(rolesAdmin);
        admin.setPermissions(permissionsAdmin);
        userService.save(admin);

        User employee = new User();
        employee.setName("Empleado");
        employee.setUserName("employee");
        employee.setEmail("employee@employee.com");
        employee.setPassword(passwordEncoder.encode("empleado"));
        Set<Role> rolesEmployee = new HashSet<Role>();
        rolesEmployee.add(roleEmployee);
        employee.setRoles(rolesEmployee);
        employee.setPermissions(permissionsEmployee);
        userService.save(employee);

        User user = new User();
        user.setName("Usuario");
        user.setUserName("user");
        user.setEmail("user@user.com");
        user.setPassword(passwordEncoder.encode("usuario"));
        Set<Role> rolesUser = new HashSet<Role>();
        rolesUser.add(roleUser);
        user.setRoles(rolesUser);
        user.setPermissions(permissionsUser);
        userService.save(user);
    }
}
