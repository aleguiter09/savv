import { useState } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Input,
  Button,
  Image,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { PasswordInput } from "../components/commons/PasswordInput";
import { register } from "../api/auth";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async () => {
    if (email !== "" && password !== "") {
      try {
        register(email, password).then((res) => {
          if (res.error) {
            throw res.error;
          } else {
            console.log("res:", res);
            router.push(`/home/${email}`);
          }
        });
      } catch (e) {
        console.error("Error:", e);
      }
    }
  };

  const handleBack = () => {
    router.push(`/`);
  };

  return (
    <>
      <Flex justifyContent="center" align="center" height="100vh">
        <Flex height="80vh" direction="column" background="gray.700" p="5">
          <Flex direction="column" m="3">
            <Heading fontWeight="bold" mb="3">
              Create account
            </Heading>
            <Image src="./register.png" boxSize="250px" mx="auto" />
          </Flex>
          <Spacer />
          <Flex direction="column" p="4">
            <Input
              placeholder="Email"
              mb="3"
              type="email"
              rounded="3"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput onChange={setPassword} />
            <Button mb="3" onClick={handleClick} rounded="25">
              Register
            </Button>
            <Flex justifyContent="center" align="center">
              <Text me="2">Have an account?</Text>
              <Text color="#90cdf4" onClick={handleBack}>
                Log in here
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Register;
