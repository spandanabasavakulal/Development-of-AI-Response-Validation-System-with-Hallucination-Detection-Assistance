
import time
from google.genai import errors


def generate_content_with_retry(
    client,
    model,
    contents,
    config=None,
    max_attempts=3
):
    """
    Generate Gemini content with retry handling
    for temporary API failures.

    Retryable errors: 429, 500, 502, 503, 504.
    """

    retryable_status_codes = {429, 500, 502, 503, 504}

    for attempt in range(1, max_attempts + 1):

        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=config
            )

            return response

        except errors.APIError as error:

            status_code = (
                getattr(error, "code", None)
                or getattr(error, "status_code", None)
            )

            if (
                status_code not in retryable_status_codes
                or attempt == max_attempts
            ):
                print(
                    f"Gemini API request failed: {error}"
                )
                raise

            wait_time = 2 ** attempt

            print(
                f"Gemini temporarily unavailable "
                f"(HTTP {status_code}). "
                f"Retrying in {wait_time} seconds... "
                f"Attempt {attempt}/{max_attempts}"
            )

            time.sleep(wait_time)

    raise RuntimeError(
        "Gemini request failed after all retry attempts."
    )
