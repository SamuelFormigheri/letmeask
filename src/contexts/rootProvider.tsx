import { AuthProvider } from "./Auth";

export function RootProvider({ children } : { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}