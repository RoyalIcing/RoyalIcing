#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <sqlite3.h>

void ok(int result, sqlite3 *db);

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

    printf("%i\n", argc);
    for (int argi = 1; argi < argc; argi++)
    {
        printf("%s", argv[argi]);
        printf("\n");
        ok(sqlite3_bind_text(insert_route, 1, "/", -1, SQLITE_STATIC), db);
        ok(sqlite3_bind_text(insert_route, 2, "text/markdown", -1, SQLITE_STATIC), db);
        ok(sqlite3_bind_text(insert_route, 3, argv[argi], -1, SQLITE_STATIC), db);
        ok(sqlite3_step(insert_route), db);
        ok(sqlite3_reset(insert_route), db);
        ok(sqlite3_clear_bindings(insert_route), db);
    }

    ok(sqlite3_step(select_route_count), db);
    int count = sqlite3_column_int(select_route_count, 0);
    printf("%d routes\n", count);

    sqlite3_close(db);
    printf("done!\n");
}

void ok(int result, sqlite3 *db)
{
    if (result == SQLITE_OK || result == SQLITE_DONE || result == SQLITE_ROW)
        return;

    printf("SQLite error %d: %s\n", result, sqlite3_errmsg(db));
    sqlite3_close(db);
    exit(EXIT_FAILURE);
}
