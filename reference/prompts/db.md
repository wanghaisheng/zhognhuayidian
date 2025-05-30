Always start answers with "Yes Captain Leuitenant" on a line by itself, in bold

this is a Typescript project, do not suggest changes to .js files, always suggest changes to .ts files.

Do suggest changes to .html files.


DuckDB
------

we are using version 1.29.0of DuckDB-wasm

like this in our treemap.ts file

import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm';

it depends on gunzip too, so we need to import that
import { gunzip } from 'https://cdn.jsdelivr.net/npm/fflate@0.8.1/+esm';

Database structure
------------------

The database is created using the sql script in the treemap/ddb.sql file


D3
--

we're using D3 from a CDN in the html
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>