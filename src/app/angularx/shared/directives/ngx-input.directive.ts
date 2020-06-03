import { Directive, Input, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';

@Directive({
    selector: '[ngxInput]'
})
export class NgxInputDirective implements OnInit {

    @Input('type') type: string = 'text';
    @Input('name') name: string = '';
    @Input('phoneFormat') format: string = '(***) ***-****';
    private _oldValue;
    private _numberRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

    constructor(private _elementRef: ElementRef, private _renderer: Renderer2, private _model: NgModel, private _ngControl: NgControl) { }

    ngOnInit() {

        if (!/^( |\(|\)|\*|-)*$/.test(this.format)) {
            this.format = '(***) ***-****';
            throw new Error('phoneFormat for ngxInput can only contain (, ), *, - or space. Reverted to default format (***) ***-****.');
        }

        this.subscribeToValueChanges();

    }

    /*-------------------------------------------------------*
     * enforceFormat() for number & tel input only
     *-------------------------------------------------------*/
    @HostListener('keydown', ['$event']) enforceFormat($event: KeyboardEvent) {

        //Maxlength manipulator from phone format
        let value = this._elementRef.nativeElement.value;
        let maxDigitFromFormat = this.format.split('').reduce((a, v) => a += (v === '*') ? v : '', '').length;

        if (this.type === 'tel') { //Enforce formatting for tel
            if (
                (!this.isNumericInput($event) && !this.isModifierKey($event)) || //Check for keyboard input
                (value.replace(/\D/g, '').length >= maxDigitFromFormat && !this.isModifierKey($event)) //Check if numbers input exceed the length of phone format
            ) {
                $event.preventDefault();
                return;
            }
        } else if (this.type === 'number') { //Enforce formatting for number
            if (!this.isNumericInput($event) && !this.isModifierKey($event) && !this.isNumericSignInput($event)) { //Check for keyboard input
                $event.preventDefault();
                return;
            }
        } else if (this.type === 'ssn') { //Enforce formatting for number
            if (
                (!this.isNumericInput($event) && !this.isModifierKey($event)) || //Check for keyboard input
                (value.replace(/\D/g, '').length >= 9 && !this.isModifierKey($event)) //Check if numbers input exceed the length of SSN format
            ) {
                $event.preventDefault();
                return;
            }
        }
        
    }

    /*-------------------------------------------------------*
     * formatToType() for tel & ssn only
     *-------------------------------------------------------*/
    @HostListener('keyup', ['$event'])
    formatToType($event: KeyboardEvent) {
        let value = this._elementRef.nativeElement.value;
        let type = this.type;

        //Only work with tel & ssn
        if (type !== 'tel' && type !== 'ssn') return;

        //Ignore if key is modifier
        if (!this.isModifierKey($event)) return;

        let result = this.formatInput(value, type);
        this._ngControl.control.setValue(result);
    }
    subscribeToValueChanges() {
        //Only subscribe to ssn & tel for auto formatting
        if (this.type !== 'ssn' && this.type !== 'tel') return;

        this._model.valueChanges.subscribe(value => {
            if (value === this._oldValue) return; //Avoid infinite loop
            this._oldValue = value;

            //When value changes on this ngModel, autoformat it
            let type = this.type;
            let result = this.formatInput(value, type);
            this._ngControl.control.setValue(result);
        });
    }

    /*---------------------------------------------------------------*
     * Helper functions
     *---------------------------------------------------------------*/
    formatInput(input, type: 'tel' | 'number' | 'ssn' | string) {

        let format = type === 'ssn' ? '***-**-****' : this.format;
        let maxDigitFromFormat = format.split('').reduce((a, v) => a += (v === '*') ? v : '', '').length;
        let result = '';

        //Remove non-numeric characters
        if (input === null || input === undefined) input = '';
        input = input.toString().replace(/\D/g, '');
        //Remove leading 1 for phone number
        if (type === 'tel' && input.length === 11 && (input.startsWith('1') || input.startsWith(1))) input = input.substr(1);
        //Only get the maximum number of digits
        input = input.substring(0, maxDigitFromFormat).split('');

        let maxDigitFromInput = input.length;
        let counter = 0; //Counter by length, not by index

        format.split('').forEach(character => {
            if (counter > maxDigitFromInput) return;

            if (character === '*') {
                result += input.length > 0 ? input[0] : '';
                input.shift();
                counter++;
            } else {
                result += character;
            }
        });

        //Remove all the non-digits at the end of the string
        while (result.length > 0 && !/\d/.test(result.substr(-1))) result = result.slice(0, -1);
    
        //Return empty if result contains no digit
        result = result.replace(/\D/g, '').length === 0 ? '' : result;

        return result;

    }

    isNumericInput($event) {

        return (
            ($event.keyCode >= 48 && $event.keyCode <= 57) || // Allow number line
            ($event.keyCode >= 96 && $event.keyCode <= 105) // Allow numpad
        );

    }

    isNumericSignInput($event) {

        return (
            ($event.keyCode === 107 || $event.keyCode === 109 || $event.keyCode === 110) || //Allow +, - and . from keypad
            ($event.keyCode === 189 || $event.keyCode === 190) || //Allow - and . from keyboard
            ($event.shiftKey === true && $event.keyCode <= 187) // Allow + (by pressing shift =) from keyboard
        );

    }

    isBackspaceKey($event) {
        return $event.keyCode === 8;
    }

    isModifierKey($event) {

        return ($event.keyCode === 16 || $event.keyCode === 36 || $event.keyCode === 35) || // Allow Shift, Home, End
                ($event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 13 || $event.keyCode === 46) || // Allow Backspace, Tab, Enter, Delete
                ($event.keyCode > 36 && $event.keyCode < 41) || // Allow left, up, right, down
                (
                    // Allow Ctrl/Command + A,C,V,X,Z
                    ($event.ctrlKey === true || $event.metaKey === true) &&
                    ($event.keyCode === 65 || $event.keyCode === 67 || $event.keyCode === 86 || $event.keyCode === 88 || $event.keyCode === 90)
                );

    }

}