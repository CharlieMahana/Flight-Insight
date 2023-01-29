<script lang="ts">
  export let seat: string;
  export let complaint: string;
  export let success = false;
  export let missing = false;
</script>

<form class="form-control mb-2 p-2" method="post">
  <h2 class="text-2xl font-bold mb-8">Contact a Flight Attendant</h2>
  <label class="mb-3 input-group">
    <span>Seat</span>
    <input
      class="input bg-base-200"
      placeholder="69A"
      name="seat"
      bind:value={seat}
    />
  </label>
  <label class="mb-3 input-group">
    <span>Report</span>
    <select name="complaint" class="p-3 w-full" bind:value={complaint}>
      <option value="food">Request Food</option>
      <option value="drink">Request Drink</option>
      <option value="blanket">Request Blanket</option>
      <option value="noise">Report Noise</option>
      <option value="hot">Cabin Too Warm</option>
      <option value="cold">Cabin Too Cold</option>
      <option value="other">Call Flight Attendant</option>
    </select>
  </label>
  <button class="btn btn-primary mb-3" type="submit">Submit</button>

  {#if success}
    <div class="mb-2">
      <div class="alert alert-success shadow-lg">
        <div>Request sent!</div>
      </div>
    </div>
  {/if}
  {#if missing}
    <div class="mb-2">
      <div class="alert alert-error shadow-lg">
        <div>Missing seat or request</div>
      </div>
    </div>
  {/if}
</form>
