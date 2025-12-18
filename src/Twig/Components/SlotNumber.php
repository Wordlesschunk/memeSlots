<?php

namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
final class SlotNumber
{
    public string $number = '0';
    public int $spinMs = 2000;
}
