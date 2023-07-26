import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Input, Button, InputGroup, InputRightElement } from "@chakra-ui/react";

export const PasswordInput = ({ onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <InputGroup size="md" mb={6}>
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Password"
        rounded={3}
        onChange={(p) => onChange(p.target.value)}
      />
      <InputRightElement width="3.2rem">
        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
          {show ? (
            <ViewOffIcon color="gray.300" ml={0} />
          ) : (
            <ViewIcon color="gray.300" />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
