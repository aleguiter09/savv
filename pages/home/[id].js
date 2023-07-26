import { useRouter } from "next/router";
import { Flex, Button } from "@chakra-ui/react";
import Balance from "../../components/balance/Balance";
import Credit from "../../components/credit/Credit";
import { useAuth } from "../../context/AuthContext";
import { FinancesProvider } from "../../context/FinancesContext";

const Home = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleBack = async (e) => {
    e.preventDefault();
    signOut();
    router.push("/");
  };

  return (
    <FinancesProvider>
      <Flex direction="column" pt="4">
        <Balance />
        <Credit />
        <Button onClick={handleBack} mx="2">
          Go back
        </Button>
      </Flex>
    </FinancesProvider>
  );
};

export default Home;
