from math import inf as infinity


def dijkstra(adjacency_matrix: list[list], origin_index: int):

    row_count = len(adjacency_matrix)

    if row_count == 0:
        raise ValueError("The adjacency matrix cannot be empty")

    for row_number in range(row_count):
        column_count = len(adjacency_matrix[row_number])

        if column_count != row_count:
            raise ValueError(
                "The amount of rows and columns in the adjacency matrix are not the same"
            )

    if origin_index not in range(row_count):
        raise IndexError(
            f"The origin's index {origin_index!r} is invalid, the index must be between 0 and {row_count} (exclusively)"
        )

    best_distances = [infinity] * row_count
    predecessors = [None] * row_count
    visited = [False] * row_count

    best_distances[origin_index] = 0

    while True:
        candidate_index = None

        for index in range(row_count):
            if visited[index] or (best_distances[index] == infinity):
                continue

            if candidate_index is None:
                candidate_index = index
            else:
                if best_distances[index] < best_distances[candidate_index]:
                    candidate_index = index

        if candidate_index is None:
            break

        visited[candidate_index] = True

        for column_number, weight in enumerate(adjacency_matrix[candidate_index]):
            if visited[column_number] or weight == infinity:
                continue

            traversal_distance = best_distances[candidate_index] + weight

            if traversal_distance < best_distances[column_number]:
                best_distances[column_number] = traversal_distance
                predecessors[column_number] = candidate_index

    return best_distances, predecessors


def find_shortest_path(
    adjacency_matrix: list[list],
    vertices_names: list[str],
    origin_name: str,
    destination_name: str,
):

    origin_index = vertices_names.index(origin_name)
    destination_index = vertices_names.index(destination_name)

    best_distances, predecessors = dijkstra(adjacency_matrix, origin_index)

    if best_distances[destination_index] == infinity:
        raise ValueError(
            f"The destination {destination_name!r} is unreachable for the origin {origin_name!r}"
        )

    indices = []

    current_index = destination_index

    while current_index is not None:
        indices.append(current_index)
        current_index = predecessors[current_index]

    route = []

    for index in reversed(indices):
        town_name = vertices_names[index]

        route.append(town_name)

    return route, best_distances[destination_index]
