import { insertCategory } from "../../../api/database";
import {
  Button,
  Input,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Flex,
  SimpleGrid,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useFinancesContext } from "../../../context/FinancesContext";

export const AddCategoryButton = ({}) => {
  const { updateCategories } = useFinancesContext();
  const [color, setColor] = useState("gray.500");

  const colors = [
    "red.500",
    "gray.500",
    "gray.800",
    "green.500",
    "blue.500",
    "blue.800",
    "yellow.500",
    "orange.500",
    "purple.500",
    "pink.500",
  ];

  const titleRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = async () => {
    const title = titleRef.current.value;
    if (title) {
      await insertCategory({
        title,
        color,
        amount: 0,
      });
      updateCategories();
    }
    onClose();
  };

  return (
    <>
      <Button size="sm" colorScheme="blue" my="2" onClick={onOpen}>
        <AddIcon me="3" fontSize="xs" />
        <Text fontSize="sm">Add category</Text>
      </Button>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent>
          <DrawerHeader fontSize="lg" pb="0" textAlign="center">
            Add Category
          </DrawerHeader>
          <DrawerBody>
            <Text fontWeight="bold" mb="2">
              Title
            </Text>
            <Input placeholder="Title" mb="3" rounded="3" ref={titleRef} />
            <Flex mb="2">
              <Text fontWeight="bold">Color: </Text>
              <Text
                ms="4"
                background={color}
                textAlign="center"
                px="2"
                rounded="20"
              >
                {color}
              </Text>
            </Flex>
            <SimpleGrid columns={5} spacing={2} mx="2">
              {colors.map((c) => (
                <Box
                  key={c}
                  background={c}
                  height="22px"
                  padding="0"
                  rounded="20"
                  onClick={() => {
                    setColor(c);
                  }}
                />
              ))}
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter>
            <Button
              fontSize="sm"
              p="3"
              colorScheme="blue"
              mr="3"
              onClick={onClose}
            >
              Close
            </Button>
            <Button fontSize="sm" p="3" onClick={handleConfirm}>
              Confirm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
