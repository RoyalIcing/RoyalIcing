#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <sqlite3.h>

void ok(int result, sqlite3 *db);
const char *file_path_to_route_path(const char *file_path);

int main(int argc, char **argv)
{
    // printf("hello world");
    sqlite3 *db;
    sqlite3_stmt *insert_route;
    sqlite3_stmt *select_route_count;
    int result;

    ok(sqlite3_open(":memory:", &db), db);

    ok(sqlite3_exec(db, "CREATE TABLE routes ("
                        "path TEXT NOT NULL PRIMARY KEY"
                        ", type TEXT DEFAULT('text/plain')"
                        ", content BLOB NOT NULL"
                        ", UNIQUE(path)"
                        ")",
                    NULL, NULL, NULL),
       db);

    sqlite3_prepare_v2(db, "INSERT INTO routes(path, type, content) VALUES (?, ?, ?)", -1, &insert_route, NULL);
    sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM routes", -1, &select_route_count, NULL);

    size_t max_size = 8 * 1024 * 1024;
    void *contents_buffer = malloc(max_size);
    printf("%i\n", argc);
    for (int argi = 1; argi < argc; argi++)
    {
        printf("%s", argv[argi]);
        printf("\n");

        const char *file_path = argv[argi];
        const char *route_path = file_path_to_route_path(file_path);
        if (route_path == NULL)
            continue;

        FILE *fp = fopen(file_path, "rb");
        int contents_size = fread(contents_buffer, 1, max_size, fp);
        if (contents_size == 0)
            continue;

        ok(sqlite3_bind_text(insert_route, 1, route_path, -1, SQLITE_STATIC), db);
        ok(sqlite3_bind_text(insert_route, 2, "text/markdown", -1, SQLITE_STATIC), db);
        ok(sqlite3_bind_text(insert_route, 3, contents_buffer, contents_size, SQLITE_STATIC), db);
        ok(sqlite3_step(insert_route), db);
        ok(sqlite3_reset(insert_route), db);
        ok(sqlite3_clear_bindings(insert_route), db);

        free(route_path);
    }
    free(contents_buffer);

    ok(sqlite3_step(select_route_count), db);
    int count = sqlite3_column_int(select_route_count, 0);
    printf("%d routes\n", count);

    sqlite3_close(db);
    printf("done!\n");
}

const char *file_path_to_route_path(const char *file_path)
{
    if (strstr(file_path, ".md") == NULL)
        return NULL;

    char *route_path = strdup(file_path);

    char *readme_md_substr = strstr(route_path, "/README.md");
    char *md_substr = strstr(route_path, ".md");

    if (readme_md_substr != NULL)
    {
        memset(readme_md_substr, 0, strlen(readme_md_substr));
    }
    else
    {
        memset(md_substr, 0, strlen(md_substr));
    }

    memmove(&route_path[1], route_path, strlen(route_path));
    memcpy(route_path, "/", 1);
    printf("%s -> %s\n", file_path, route_path);

    return route_path;
}

void ok(int result, sqlite3 *db)
{
    if (result == SQLITE_OK || result == SQLITE_DONE || result == SQLITE_ROW)
        return;

    printf("SQLite error %d: %s\n", result, sqlite3_errmsg(db));
    sqlite3_close(db);
    exit(EXIT_FAILURE);
}
