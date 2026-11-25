from classes import Graph, Vertex
from user_input import prompt_input_locations
from pathfinding import find_shortest_path
from pretty_print import (
    pretty_print_adjacency_matrix,
    pretty_print_results,
    pretty_print_vertex_degrees,
)
from rich.console import Console


def create_graph():

    city: Vertex = Vertex("Mérida")

    magic_towns = [
        Vertex("Maní"),
        Vertex("Espita"),
        Vertex("Izamal"),
        Vertex("Motul"),
        Vertex("Sisal"),
        Vertex("Tekax"),
        Vertex("Valladolid"),
    ]

    graph: Graph = Graph(name="Pueblos", initial_vertex=city)

    for magic_town in magic_towns:
        graph.insert_vertex(magic_town)

    """
    El peso o distancia de cada arista se expresa en kilómetros y representa
    el recorrido de un territorio a uno vecino a través de una o más
    carreteras.

    Fuentes:
        * Peso de la arista Sisal-Mérida: 

        https://ca.drivebestway.com/distance/sisal-mx/m%C3%A9rida-mx

        * Pesos de las aristas Mérida-Motul, Motul-Izamal y Mérida-Izamal:

        * Peso de la arista Espita-Valladolid:

        https://www.rome2rio.com/map/Espita-Municipality/Valladolid-Yucat%C3%A1n-Mexico?route=Drive&segment=0&accom_comparison=true

        * Peso de la arista Izamal-Espita:

        https://www.rome2rio.com/es/map/Municipio-de-Izamal/Municipio-de-Espita?route=Drive&segment=0&accom_comparison=true

        * Peso de la arista Mérida-Maní:

        https://ca.drivebestway.com/distance/m%C3%A9rida-mx/man%C3%AD-mx

        * Peso de la arista Maní-Tekax:

        https://www.rome2rio.com/map/Man%C3%AD-Municipality/Tekax-Municipality?accom_comparison=true&route=Drive&segment=0

        * Pesos del resto de aristas:

        https://www.drivebestway.com/mileage-chart-with-distances-between-cities/mx-yucatan
    """
    graph.insert_edge("Sisal", "Mérida", 54)
    graph.insert_edge("Mérida", "Motul", 43)
    graph.insert_edge("Motul", "Izamal", 38)
    graph.insert_edge("Mérida", "Izamal", 71)
    graph.insert_edge("Izamal", "Espita", 76)
    graph.insert_edge("Espita", "Valladolid", 51)
    graph.insert_edge("Mérida", "Maní", 95)
    graph.insert_edge("Maní", "Tekax", 39)

    return graph


def main() -> int:

    console = Console()
    graph = create_graph()

    adjacency_matrix = graph.create_adjacency_matrix()

    vertices = graph.vertices

    vertices_names = list(vertices.keys())

    pretty_print_vertex_degrees(vertices, trailing_newlines=1)

    pretty_print_adjacency_matrix(
        console, adjacency_matrix, vertices_names, trailing_newlines=1
    )

    origin_name, destination_name = prompt_input_locations(
        vertices_names, trailing_newlines=1
    )

    route, best_distances = find_shortest_path(
        adjacency_matrix,
        vertices_names,
        origin_name,
        destination_name,
    )

    pretty_print_results(route, best_distances)

    return 0


if __name__ == "__main__":
    main()
