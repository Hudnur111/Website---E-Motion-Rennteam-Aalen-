/**
 * Invisible spam-trap field. Real visitors never see or fill it in; bots
 * that blindly fill every input trip it, letting the API route silently
 * discard the submission without tipping the bot off (it still gets a
 * success response).
 */
export default function HoneypotField() {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="website">Firmenwebsite (bitte freilassen)</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
