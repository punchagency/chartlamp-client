import { pxToRem, SECONDARY } from "@/theme";
import { Typography } from "@mui/material";
import React from "react";

type Props = {
  content: string;
  highlight: string;
  alt?: string[];
};

const HighlightedText: React.FC<Props> = ({ content, highlight, ...rest }) => {
  function highlightText(
    text: string,
    phraseToHighlight: string,
    alt?: string[]
  ) {
    if (!phraseToHighlight && !alt) {
      return text; // No highlight if neither phrase nor alt is provided
    }

    const phrasesToHighlight = [phraseToHighlight];
    if (alt && alt.length) {
      phrasesToHighlight.concat(alt);
    }

    // Combine phrases into one regex
    const escapedPhrases = phrasesToHighlight.map((phrase) =>
      phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    );

    const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi"); // Matches any phrase or alt

    const parts = text.split(regex);

    return parts.map((part, index) => {
      const match = phrasesToHighlight.some(
        (phrase) => part.toLowerCase() === phrase.toLowerCase()
      );

      return match ? (
        <Typography
          key={index}
          variant="body1"
          lineHeight={pxToRem(19.2)}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {part}
        </Typography>
      ) : (
        part
      );
    });
  }

  return (
    <Typography
      variant="body1"
      color={SECONDARY[400]}
      lineHeight={pxToRem(19.2)}
    >
      {highlightText(content, highlight, rest.alt)}
    </Typography>
  );
};

export default HighlightedText;
