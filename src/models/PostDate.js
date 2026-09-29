const postDate = (
    id,
    imageUrl,
    eventTitle,
    date,
    time,
    tags,
    description
) => {
    return {
        id,
        imageUrl,
        eventTitle,
        date,
        time,
        tags,
        description
    };
};

export default postDate;