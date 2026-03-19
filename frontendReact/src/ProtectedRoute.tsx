import { Navigate } from 'react-router-dom';

function ProtectedRoute({children, dozwoloneRole}: {
    children: React.ReactNode
    dozwoloneRole?: string[]
}){
    const userStr = localStorage.getItem('user')
    if(!userStr){
        return<Navigate to="/"/>;
    }

    const user = JSON.parse(userStr);

    if(dozwoloneRole && !dozwoloneRole.includes(user.rola)){
        localStorage.clear();
        return <Navigate to="/"/>
    }
    return <>{children}</>
}

export default ProtectedRoute;