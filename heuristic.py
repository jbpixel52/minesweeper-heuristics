def infer (int x, int y):
{
    int n = a[x][y];
    int closed = count_neighbors(x, y, CLOSED);
    int marked = count_neighbors(x, y, MARKED);
    if (closed == n - marked)
        return assign_neighbors(x, y, CLOSED, MARKED);
    if (marked == n)
        return assign_neighbors(x, y, CLOSED, OPENED);
}

def heuristic():
    int changes;
    do {
        changes = 0;
        for (int x= 0; x<N; x++)
            for (int y=0; y <M; y++)
                changes += deduce(x, y);
    } while (changes); 


# Example implementation of count_neighbors function
def count_neighbors(x, y, status):
    count = 0
    # Check the status of all neighboring cells
    for i in range(x-1, x+2):
        for j in range(y-1, y+2):
            if (i != x or j != y) and is_valid_cell(i, j):
                if a[i][j] == status:
                    count += 1
    return count

# Example implementation of assign_neighbors function
def assign_neighbors(x, y, old_status, new_status):
    count = 0
    # Assign the new status to all neighboring cells with the old status
    for i in range(x-1, x+2):
        for j in range(y-1, y+2):
            if (i != x or j != y) and is_valid_cell(i, j):
                if a[i][j] == old_status:
                    a[i][j] = new_status
                    count += 1
    return count

# Example implementation of deduce function
def deduce(x, y):
    # Perform deductions based on the revealed and marked cells
    changes = 0
    if a[x][y] != CLOSED:
        return changes  # Skip already revealed cells

    inferred = infer(x, y)
    if inferred:
        changes += inferred

    return changes

# Example implementation of is_valid_cell function
def is_valid_cell(x, y):
    # Check if the given coordinates are within the valid range of the board
    return 0 <= x < N and 0 <= y < M
