# List of Pools
✅
## Success Case
1. ⛔ Receives a **GET** request on the route **api/survey**
2. ⛔ Check if the request owner is a user
3. ⛔ Returns 200 with the poll data

## Exception
1. ⛔ Returns 404 if the API doesnt exist
2. ⛔ Returns 403 if is not an user that requested it
3. ⛔ Returns error 500 if notify an error when trying to access the poll