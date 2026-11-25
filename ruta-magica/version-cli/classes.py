from math import inf as infinity


class Edge:
    def _is_valid_edge_weight(self, weight: float):
        return weight > 0

    def _check_edge_weight(self, weight: float):
        if not self._is_valid_edge_weight(weight):
            raise ValueError(
                f"Cannot create an edge with the weight {weight!r}, the weight must be a positive real number"
            )

    def __init__(self, end1, end2, weight: float):
        self._check_edge_weight(weight)

        self.end1 = end1
        self.end2 = end2
        self.weight = weight

    def is_loop(self):
        return self.end1.name == self.end2.name

    def is_parallel(self, edge):
        if edge == self:
            return False

        elif (
            (self.end1.name == edge.end1.name)
            and (self.end2.name == edge.end2.name)
            or (self.end1.name == edge.end2.name)
            and (self.end2.name == edge.end1.name)
        ):
            return True

        return False

    def other_end(self, vertex):
        if vertex.name == self.end1.name:
            return self.end2

        elif vertex.name == self.end2.name:
            return self.end1

        else:
            raise ValueError(
                f"No se pudo obtener el otro extremo de esta arista respecto al vértice {vertex.name!r} porque la arista no incide en él"
            )

    def __repr__(self):
        return f"Edge(end1={self.end1}, end2={self.end2}, weight={self.weight})"


class Vertex:
    def _is_valid_vertex_name(self, name: str):
        if name is None or len(name) == 0 or not name.isalpha():
            return False

        return True

    def _check_vertex_name(self, name: str):
        if not self._is_valid_vertex_name(name):
            raise ValueError(
                f"No se puede nombrar el vértice {name!r}, el nombre debe ser uno o más caracteres alfabéticos"
            )

    def __init__(self, name: str):
        self._check_vertex_name(name)

        self.name = name
        self.incident_edges = []

    def insert_edge(self, edge: Edge):
        self.incident_edges.append(edge)

    def degree(self):
        return len(self.incident_edges)

    def is_adjacent(self, vertex):
        for edge in self.incident_edges:
            neighbor_vertex = edge.other_end(self)

            if neighbor_vertex.name == vertex.name:
                return True

        return False

    def __repr__(self):
        return f"Vertex(name={self.name}, incident_edges={self.incident_edges})"


class Graph:
    def _is_valid_graph_name(self, name: str):
        if name is None or len(name) == 0 or not name.isalpha():
            return False

        return True

    def _check_graph_name(self, name: str):
        if not self._is_valid_graph_name(name):
            raise ValueError(
                f"No se puede nombrar al grafo {name!r}, el nombre debe ser uno o más caracteres alfabéticos"
            )

    def __init__(self, name: str, initial_vertex: Vertex):
        self._check_graph_name(name)

        self.name = name
        self.vertices = {}

        self.insert_vertex(initial_vertex)

    def insert_vertex(self, vertex: Vertex):
        if vertex.name in self.vertices:
            raise ValueError(
                f"No se puede añadir el vértice {vertex.name!r}, ya existe un vértice con el mismo nombre"
            )

        self.vertices[vertex.name] = vertex

    def find_vertex(self, name: str):
        return self.vertices[name]

    def insert_edge(self, end1_name: str, end2_name: str, weight: float):
        end1: Vertex = self.find_vertex(end1_name)
        end2: Vertex = self.find_vertex(end2_name)

        new_edge: Edge = Edge(end1, end2, weight)

        if new_edge.is_loop():
            raise ValueError("No se puede añadir una arista con extremos iguales")

        if end1.is_adjacent(end2):
            raise ValueError(
                "No se puede añadir una arista cuyos vértices son adyacentes"
            )

        end1.insert_edge(new_edge)
        end2.insert_edge(new_edge)

    def _find_vertex_index(self, target: Vertex):
        index = None

        for i, vertex in enumerate(self.vertices.values()):
            if vertex.name == target.name:
                index = i
                break

        if index is None:
            raise KeyError

        return index

    def create_adjacency_matrix(self):
        matrix = []

        size = len(self.vertices)

        for i in range(size):
            matrix.insert(i, [])
            for j in range(size):
                if i == j:
                    matrix[i].insert(j, 0)
                else:
                    matrix[i].insert(j, infinity)

        for vertex in self.vertices.values():
            for incident_edge in vertex.incident_edges:
                end1 = incident_edge.end1
                end2 = incident_edge.end2

                index_end1 = self._find_vertex_index(end1)
                index_end2 = self._find_vertex_index(end2)

                matrix[index_end1][index_end2] = incident_edge.weight
                matrix[index_end2][index_end1] = incident_edge.weight

        return matrix
