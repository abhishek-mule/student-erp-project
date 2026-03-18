"use client";

import { useAuth } from "@clerk/nextjs";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_placeholder", {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        capture_pageview: false, // Handled manually
    });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    const { user, orgId } = useAuth();

    useEffect(() => {
        if (user) {
            posthog.identify(user.id, {
                email: user.emailAddresses[0]?.emailAddress,
                name: user.fullName,
                tenantId: orgId,
            });

            Sentry.setContext("tenant", {
                id: orgId,
            });
            Sentry.setUser({
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress,
            });
        }
    }, [user, orgId]);

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
