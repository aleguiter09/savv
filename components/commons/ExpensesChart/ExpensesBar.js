import { deleteCategory, updateCategory } from "../../../api/database";
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
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useFinancesContext } from "../../../context/FinancesContext";

export const ExpenseBar = ({ id, category, total }) => {
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
  const { updateCategories } = useFinancesContext();
  const [color, setColor] = useState(category.color);

  const handleConfirm = async () => {
    const title = titleRef.current.value;
    if (title) {
      await updateCategory(id, {
        title,
        color,
      });
    }
    updateCategories();
    onClose();
  };

  const handleDelete = async () => {
    await deleteCategory(id);
    updateCategories();
    onClose();
  };

  return (
    <>
      <Flex mb="2" key={category.id}>
        <Box
          ps="2"
          w={`${(category.amount * 100) / total}%`}
          h="25"
          bg={category.color ? category.color : "blue.500"}
          onClick={onOpen}
        >
          <Text w="fit-content" whiteSpace="nowrap">
            {category.title} - ${category.amount}
          </Text>
        </Box>
      </Flex>

      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent>
          <DrawerHeader fontSize="lg" pb="0" textAlign="center">
            Edit Category
          </DrawerHeader>
          <DrawerBody>
            <Text fontWeight="bold" mb="2">
              Title
            </Text>
            <Input
              placeholder="Title"
              mb="3"
              rounded="3"
              ref={titleRef}
              defaultValue={category.title}
            />
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
              colorScheme="red"
              onClick={handleDelete}
              me="auto"
            >
              Delete
            </Button>
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
