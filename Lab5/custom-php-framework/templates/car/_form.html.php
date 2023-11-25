<?php
    /** @var $car ?\App\Model\Car */
?>

<div class="form-group">
    <label for="brand">Marka</label>
    <input type="text" id="brand" name="car[brand]" value="<?= $car ? $car->getBrand() : '' ?>">
</div>

<div class="form-group">
    <label for="model">Model</label>
    <input type="text" id="model" name="car[model]" value="<?= $car ? $car->getModel() : '' ?>">
</div>

<div class="form-group">
    <label for="color">Kolor</label>
    <input type="text" id="color" name="car[color]" value="<?= $car ? $car->getColor() : '' ?>">
</div>

<div class="form-group">
    <label for="price">Cena</label>
    <input type="number" id="price" name="car[price]" value="<?= $car ? $car->getPrice() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
