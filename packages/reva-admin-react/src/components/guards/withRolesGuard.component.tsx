import { redirect } from "next/navigation";

import { useAuth } from "../auth/auth";
import { useHasRoles } from "../auth/role";
import { UserRole } from "../auth/types";

interface Props {
  roles: UserRole[];
  children: React.ReactNode;
}

export const RolesGuard = (props: Props): JSX.Element => {
  const { children, roles } = props;

  const { hasRoles } = useHasRoles();
  const {
    isAdmin,
    isCertificationAuthority,
    isOrganism,
    isGestionnaireMaisonMereAAP,
    isAdminCertificationAuthority,
  } = useAuth();

  // Redirect user to default path based on role
  if (!hasRoles(roles)) {
    if (isAdmin || isOrganism || isGestionnaireMaisonMereAAP) {
      redirect("/candidacies");
    } else if (isAdminCertificationAuthority || isCertificationAuthority) {
      redirect("/candidacies/feasibilities");
    }

    return <div>Vous n'avez pas accès à cette fonctionnalité</div>;
  }

  return <>{children}</>;
};

export const withRolesGuard =
  (roles: UserRole[]) =>
  <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithRolesGuard = (props: P) => {
      return (
        <RolesGuard roles={roles}>
          <WrappedComponent {...props} />
        </RolesGuard>
      );
    };

    WithRolesGuard.displayName = `WithRolesGuard(${getDisplayName(
      WrappedComponent,
    )})`;

    return WithRolesGuard;
  };

/**
 * Get display name for HOCs
 * Used for cleaner names in react dev tools
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDisplayName = (WrappedComponent: React.ComponentType<any>) =>
  WrappedComponent.displayName || WrappedComponent.name || "Component";
