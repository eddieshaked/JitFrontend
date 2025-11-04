import { AppContainer } from './AppLayout.styles';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return <AppContainer>{children}</AppContainer>;
};

