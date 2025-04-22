/*
    SQL functions for Supabase RPC
*/

CREATE FUNCTION get_all_decks()
RETURNS TABLE (
    User_id UUID, 
    Deck_id INT8, 
    Title VARCHAR, 
    Group_id INT8, 
    Username TEXT,
    Private BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        "Users"."User_id", 
        "Decks"."Deck_id", 
        "Decks"."Title", 
        "Decks"."Group_id", 
        "Users"."Username",
        "Users"."Private"
    FROM "Users"
    LEFT JOIN "Decks"
    ON "Users"."User_id" = "Decks"."User_id";
END;
$$ LANGUAGE plpgsql;



CREATE FUNCTION get_user_decks(my_user_id UUID)
RETURNS TABLE (
    User_id UUID, 
    Deck_id INT8, 
    Title VARCHAR, 
    Group_id INT8, 
    Username TEXT,
    Private BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        "Users"."User_id", 
        "Decks"."Deck_id", 
        "Decks"."Title", 
        "Decks"."Group_id", 
        "Users"."Username",
        "Users"."Private"
    FROM "Users"
    LEFT JOIN "Decks"
    ON "Users"."User_id" = "Decks"."User_id"
    WHERE "Users"."User_id" = "my_user_id";
END;
$$ LANGUAGE plpgsql;



CREATE FUNCTION get_not_user_decks(my_user_id UUID)
RETURNS TABLE (
    User_id UUID, 
    Deck_id INT8, 
    Title VARCHAR, 
    Group_id INT8, 
    Username TEXT,
    Private BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        "Users"."User_id", 
        "Decks"."Deck_id", 
        "Decks"."Title", 
        "Decks"."Group_id", 
        "Users"."Username",
        "Users"."Private"
    FROM "Users"
    LEFT JOIN "Decks"
    ON "Users"."User_id" = "Decks"."User_id"
    WHERE "Users"."User_id" != "my_user_id";
END;
$$ LANGUAGE plpgsql;



CREATE FUNCTION get_liked_decks(my_user_id UUID)
RETURNS TABLE (
    liker_user_id UUID, 
    user_id UUID,
    username TEXT,
    deck_id INT8, 
    title VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        uld."User_id" AS liker_user_id,
        d."User_id" AS user_id,
        u."Username" AS username,
        uld."Deck_id" AS deck_id, 
        d."Title" AS title
    FROM "UserLikedDecks" uld
    JOIN "Decks" d ON uld."Deck_id" = d."Deck_id"
    JOIN "Users" u ON d."User_id" = u."User_id"
    WHERE uld."User_id" = my_user_id;
END;
$$ LANGUAGE plpgsql;