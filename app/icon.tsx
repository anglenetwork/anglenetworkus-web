import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

const INSTRUMENT_SANS_BOLD_URL =
  "https://fonts.gstatic.com/s/instrumentsans/v4/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npSQi_gf1.ttf";

export default async function Icon() {
  const instrumentSansBold = await fetch(INSTRUMENT_SANS_BOLD_URL).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Sans",
            fontSize: 22,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1,
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Sans",
          data: instrumentSansBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
