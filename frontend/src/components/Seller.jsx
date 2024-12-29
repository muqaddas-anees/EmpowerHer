import SellerAuth from "./SellerAuth";
import ProductManagement from "./ProductManagement";
import ProfileManagement from "./ProfileManagement";

import { useAuth } from "./AuthContext";

const Seller = () => {
  // const navigate= navigator.navigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="p-4 pt-20">
        {/* <ProductManagement/>
      <ProfileManagement/> */}
        {isAuthenticated ? (
          // If authenticated, show the seller dashboard
          <>
            <ProductManagement />
            <ProfileManagement />
          </>
        ) : (
          <SellerAuth />
        )}
      </div>
    </>
  );
};

export default Seller;
