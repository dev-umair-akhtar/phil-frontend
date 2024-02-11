import {
    Box,
    Chip,
    ChipProps,
    Typography,
    TypographyProps,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    text: string;
    typographyProps?: TypographyProps;
    chipProps?: ChipProps;
    [key: string]: any;
};

export const ParseTags = ({
    text,
    typographyProps = {},
    chipProps = {},
    ...props
}: Props) => {
    const [tags, setTags] = useState<string[] | null>(null);
    const [actualText, setActualText] = useState("");

    useEffect(() => {
        const tagsRegex = /(\[[a-zA-Z0-9\- ]*\])*/;
        const _tags = ("" + text).match(tagsRegex);
        const _actualText = ("" + text).split("]").slice(-1)[0];

        if (_tags) {
            setTags(Array.from(new Set(_tags.filter((_t) => Boolean(_t)))));
        }
        setActualText(_actualText);
    }, [text]);

    return tags ? (
        <Box
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
            {...props}
        >
            {tags.map((tag) => (
                <Chip label={tag.slice(1, -1)} size="small" {...chipProps} />
            ))}
            <Typography {...typographyProps}>{actualText}</Typography>
        </Box>
    ) : (
        <Typography {...typographyProps}>{text}</Typography>
    );
};
