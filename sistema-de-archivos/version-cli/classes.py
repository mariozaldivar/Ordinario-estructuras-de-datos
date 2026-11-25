from constants import (
    MAX_FILE_EXTENSION_LENGTH,
    ROOT_DIRECTORY_NAME,
)


class Node:
    def _is_printable_ascii_string(self, string: str):

        return string.isascii() and string.isprintable()

    def __init__(
        self,
        name: str,
        file_type: str,
        size: int = 0,
        extension: str | None = None,
        left: Node | None = None,
        right: Node | None = None,
    ):
        if not self._is_printable_ascii_string(name):
            raise ValueError(
                "The file or directory name must be a string of printable ASCII characters"
            )

        if len(name) == 0:
            raise ValueError("The file or directory cannot be the empty string")

        if file_type.lower() not in ("file", "directory"):
            raise ValueError("The file type must be specified as 'file' or 'directory'")

        if file_type.lower() == "file":
            if extension is None:
                raise ValueError("An extension must be specified for a file")

            elif len(extension) == 0:
                raise ValueError("The file extension cannot be the empty string")

            elif not self._is_printable_ascii_string(extension):
                raise ValueError(
                    "The file extension must be a string of printable ASCII characters"
                )

            elif len(extension) > MAX_FILE_EXTENSION_LENGTH:
                raise ValueError(
                    f"The file extension length cannot exceed {MAX_FILE_EXTENSION_LENGTH} printable ASCII characters"
                )

        if size < 0:
            raise ValueError("The file size must be greater than or equal to zero")

        self.name = name
        self.size = size
        self.extension = extension
        self.file_type = file_type

        self.left = left
        self.right = right

    def is_file(self):
        return self.file_type == "file"

    def is_directory(self):
        return self.file_type == "directory"

    def _pretty_print_attributes(self):
        for attribute, value in vars(self).items():
            if attribute in ("name", "size", "extension", "file_type"):
                formatted_attribute_name = attribute.replace("_", " ").capitalize()

                print(f"{formatted_attribute_name}: {value}")

    def __repr__(self):
        return f"Node(name={self.name}, extension={self.extension}, size={self.size}, file_type={self.file_type}, left={self.left}, right={self.right})"


class BinaryTree:
    def __init__(self, root: Node | None = None):
        if root is None:
            self.root = Node(name=ROOT_DIRECTORY_NAME, file_type="directory")
        else:
            if not root.is_directory():
                raise ValueError("The root of the filesystem must be a directory")

            self.root = root

    def count_children_nodes(self, target_node: Node):
        children = 0

        if target_node.left is not None and target_node.right is not None:
            children = 2

        elif (target_node.left is not None and target_node.right is None) or (
            target_node.left is None and target_node.right is not None
        ):
            children = 1

        return children

    def search(self, target_name: str):

        current_node: Node = self.root

        while current_node is not None:
            if target_name < current_node.name:
                current_node = current_node.left

            elif target_name > current_node.name:
                current_node = current_node.right

            else:
                break

        if current_node is None:
            raise KeyError(f"Could not find an element with the name {target_name}")

        return current_node

    def delete(self, target_name: str):

        target_node = self.search(target_name)

        if target_node == self.root:
            raise ValueError("Cannot delete the root directory")

        current_node: Node = self.root
        previous_node: Node | None = None

        while current_node is not None:
            if target_node.name < current_node.name:
                previous_node = current_node
                current_node = current_node.left

            elif target_node.name > current_node.name:
                previous_node = current_node
                current_node = current_node.right

            else:
                break

        match self.count_children_nodes(target_node):
            case 2:
                current_node: Node = target_node.right
                previous_node: Node = target_node

                while current_node.left is not None:
                    previous_node = current_node

                    current_node = current_node.left

                minimum_node = current_node

                if not minimum_node.is_directory():
                    raise ValueError(
                        f"Cannot delete the element with the name {target_node.name}, its replacement (a file) cannot contain two elements"
                    )

                target_node.name = minimum_node.name
                target_node.file_type = minimum_node.file_type
                target_node.size = minimum_node.size
                target_node.extension = minimum_node.extension

                if previous_node.name == target_node.name:
                    previous_node.right = current_node.right
                else:
                    previous_node.left = current_node.right

            case 1:
                if target_node.left is None:
                    replacement = target_node.right
                else:
                    replacement = target_node.left

                if target_node.name < previous_node.name:
                    previous_node.left = replacement
                elif target_node.name > previous_node.name:
                    previous_node.right = replacement

            case 0:
                if target_node.name < previous_node.name:
                    previous_node.left = None
                elif target_node.name > previous_node.name:
                    previous_node.right = None

    def insert(self, new_node: Node):

        current_node: Node = self.root
        previous_node: Node | None = None

        while current_node is not None:
            previous_node = current_node

            if current_node.name == new_node.name:
                raise ValueError(
                    f"Cannot insert element with the name {new_node.name!r}, there is already an element with such name"
                )

            if new_node.name < current_node.name:
                current_node = current_node.left
            elif new_node.name > current_node.name:
                current_node = current_node.right

        if not previous_node.is_directory():
            raise ValueError(
                f"Cannot insert element in node {previous_node.name!r}, a file cannot contain other elements"
            )

        if new_node.name < previous_node.name:
            previous_node.left = new_node

        elif new_node.name > previous_node.name:
            previous_node.right = new_node

    def _trajectorize_preorder_traversal(self, node: Node):
        trajectory = []

        if node is not None:
            trajectory.append(node)

            trajectory.extend(self._trajectorize_preorder_traversal(node.left))
            trajectory.extend(self._trajectorize_preorder_traversal(node.right))

        return trajectory

    def _trajectorize_inorder_traversal(self, node: Node):
        trajectory = []

        if node is not None:
            trajectory.extend(self._trajectorize_inorder_traversal(node.left))

            trajectory.append(node)

            trajectory.extend(self._trajectorize_inorder_traversal(node.right))

        return trajectory

    def _trajectorize_postorder_traversal(self, node: Node):
        trajectory = []

        if node is not None:
            trajectory.extend(self._trajectorize_postorder_traversal(node.left))

            trajectory.extend(self._trajectorize_postorder_traversal(node.right))

            trajectory.append(node)

        return trajectory

    def trajectorize_traversal(self, algorithm: str):
        if algorithm.lower() not in ("pre", "in", "post"):
            raise ValueError("The traversal algorithm must be 'pre', 'in', or 'post'")

        match algorithm:
            case "pre":
                trajectory = self._trajectorize_preorder_traversal(self.root)
            case "in":
                trajectory = self._trajectorize_inorder_traversal(self.root)
            case "post":
                trajectory = self._trajectorize_postorder_traversal(self.root)

        return trajectory

    def __repr__(self):
        return f"BinaryTree(root={self.root})"
