"use client";

import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function UnauthSidebar() {
  return (
    <div className="sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">Login to access your profile and connect with others.</p>
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <Button className="w-full mt-2" variant="default">
              Sign in
            </Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}

export default UnauthSidebar;
