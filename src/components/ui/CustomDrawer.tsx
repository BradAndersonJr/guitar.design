import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const CustomDrawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
CustomDrawer.displayName = "CustomDrawer"

const CustomDrawerTrigger = DrawerPrimitive.Trigger

const CustomDrawerPortal = DrawerPrimitive.Portal

const CustomDrawerClose = DrawerPrimitive.Close

const CustomDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50", className)} // Removed bg-black/80
    {...props}
  />
))
CustomDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const CustomDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CustomDrawerPortal>
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex h-full w-full flex-col bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-200" />
      {children}
    </DrawerPrimitive.Content>
  </CustomDrawerPortal>
))
CustomDrawerContent.displayName = "CustomDrawerContent"

const CustomDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
CustomDrawerHeader.displayName = "CustomDrawerHeader"

const CustomDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
CustomDrawerFooter.displayName = "CustomDrawerFooter"

const CustomDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CustomDrawerTitle.displayName = DrawerPrimitive.Title.displayName

const CustomDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CustomDrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  CustomDrawer,
  CustomDrawerPortal,
  CustomDrawerOverlay,
  CustomDrawerTrigger,
  CustomDrawerClose,
  CustomDrawerContent,
  CustomDrawerHeader,
  CustomDrawerFooter,
  CustomDrawerTitle,
  CustomDrawerDescription,
}
