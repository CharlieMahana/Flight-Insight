<form class="form-control mb-3 p-2">
  <h2 class="text-2xl font-bold mb-8">Contact a Flight Attendant</h2>
  <label class="mb-10 input-group">
    <span>Seat</span>
    <input class="input bg-base-200" placeholder="69A" name="seat" />
  </label>
  <label class="mb-10 input-group">
    <span>Report</span>
    <select name="complaint" class="p-3 w-full">
      <option value="food">Request Food</option>
      <option value="drink">Request Drink</option>
      <option value="blanket">Request Blanket</option>
      <option value="noise">Report Noise</option>
      <option value="hot">Cabin Too Warm</option>
      <option value="cold">Cabin Too Cold</option>
      <option value="other">Call Flight Attendant</option>
    </select>
  </label>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
