<?php

/** @var \App\Model\Car $car */
/** @var \App\Service\Router $router */

$title = "{$car->getBrand()} {$car->getModel()} ({$car->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $car->getBrand() ?>  <?= $car->getModel() ?></h1>
    <font color="#008b8b">Color:</font> <?= $car->getColor();?>
    <br/>
    <font color="#008b8b">Price:</font> <?= $car->getPrice() ?>
    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('car-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('car-edit', ['id'=> $car->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
