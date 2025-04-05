
import { Navigate } from 'react-router-dom';
import { useFlowAuth } from '@/integrations/flow/useFlowAuth';

const Index = () => {
  const { isConnected } = useFlowAuth();
  
  if (isConnected) {
    return <Navigate to="/my-village" />;
  }
  
  return <Navigate to="/" />;
};

export default Index;
