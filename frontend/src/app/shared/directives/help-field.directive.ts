import { Directive, Input, HostListener } from '@angular/core';
import { HelpService } from '../../core/services/help.service';

@Directive({
  selector: '[appHelpField]',
  standalone: true
})
export class HelpFieldDirective {
  @Input('appHelpField') helpNodeKey: string | null = null;

  constructor(private helpService: HelpService) {}

  @HostListener('focus')
  @HostListener('focusin')
  onFocus(): void {
    if (this.helpNodeKey) {
      this.helpService.setActiveFieldNodeKey(this.helpNodeKey);
    }
  }

  @HostListener('blur')
  @HostListener('focusout')
  onBlur(): void {
    this.helpService.setActiveFieldNodeKey(null);
  }
}
