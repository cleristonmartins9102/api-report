## Success Case

1. ⛔ Receives a request **PUT** on the route **/api/surveys/{survey_id}/results**
2. ⛔ Check if the request is **user** an owner
3. ⛔ Check the param **survey_id**
4. ⛔ Check if the field **answer** is a valid answer
5. ⛔ **Create** a poll result with the data provided if exist a record
6. ⛔ **Update** a poll result with the data provided if alread a record
7. ⛔ Returns **200** with the data of results of the poll

## Exceptions

1. ⛔ Returns error **404** if an API does not exits
2. ⛔ Returns error **403** if dont is an user
3. ⛔ Returns error **403** if the survey_if sent together URL is invalid 
4. ⛔ Returns error **403** if a API does not exits
5. ⛔ Returns error **500** if a API does not exits
6. ⛔ Returns error **500** if a API does not exits

