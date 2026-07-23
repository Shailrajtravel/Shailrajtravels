$modules = @("auth", "bookings", "packages", "tours", "gallery", "dashboard", "contacts", "invoices", "audit", "users", "settings")

foreach ($module in $modules) {
    npx @nestjs/cli g module $module
    npx @nestjs/cli g controller $module
    npx @nestjs/cli g service $module
}
