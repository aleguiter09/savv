import { useState } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Input,
  Button,
  Text,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { PasswordInput } from "../components/commons/PasswordInput";
import { login } from "../api/auth";

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (email && password) {
      try {
        login(email, password).then((res) => {
          if (res.error) {
            throw res.error;
          } else {
            router.push(`/home/${email}`);
          }
        });
      } catch (e) {
        console.error("Error:", e);
      }
    }
  };

  const handleSignUp = () => {
    router.push(`/register`);
  };

  return (
    <>
      <Flex justifyContent="center" align="center" height="100vh">
        <Flex height="80vh" direction="column" background="gray.700" p="5">
          <Flex direction="column" m="3">
            <Heading fontWeight="bold">Welcome!</Heading>
            <Text mb="6">Please... sign in</Text>
            <Image src="./login.png" boxSize="250px" mx="auto" />
          </Flex>
          <Spacer />
          <Flex direction="column" p="4" mt="-5">
            <Input
              placeholder="Email"
              mb="3"
              type="email"
              rounded="3"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput onChange={setPassword} />
            <Button mb="3" onClick={handleSignIn} rounded="25">
              Sign In
            </Button>
            <Flex justifyContent="center" align="center">
              <Text me="2">New in here?</Text>
              <Text color="#90cdf4" onClick={handleSignUp}>
                Create account
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
